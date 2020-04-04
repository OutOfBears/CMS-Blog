using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CMS.Misc;
using CMS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CMS.Controllers
{
    [Route("api/posts")]
    [EnableCors("default")]
    public class PostsController : Controller
    {
        protected readonly PostsService _postsService;
        protected readonly UserService _userService;

        public PostsController(
            PostsService postsService,
            UserService userService
        )
        {
            _postsService = postsService;
            _userService = userService;
        }


        // Methods
        [HttpGet]
        public async Task<ActionResult> Index(
            [FromQuery] int start = 0,
            [FromQuery] int limit = 20,
            [FromQuery] string user = ""
        )
        {
            if (start < 0)
                return BadRequest("start cannot be negative");
            if (limit < 0)
                return BadRequest("Limit cannot be negative");
            if (limit > 100)
                return BadRequest("Limit cannot be over 100");

            return Json(new {
                totalAmount = await _postsService.GetTotalPosts(),
                data = await _postsService.GetPosts(start, limit, user)
            });
        }


        [HttpGet]
        [Route("popular")]
        public async Task<ActionResult> Popular([FromQuery] int limit = 5)
        {
            if (limit > 10)
                return BadRequest("Limit cannot be over 10");
            if (limit < 0)
                return BadRequest("Limit cannot be negative");

            return Json(await _postsService.GetPopularPosts(limit));
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> IndexView (
            string id
        )
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest();

            var post = await _postsService.GetPost(id);
            if (post == null) return NotFound();

            await _postsService.IncrementView(id);

            return Json(post);
        }

        [Authorize]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> IndexDelete (
            string id
        )
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest();

            var userId = this.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var post = await _postsService.GetPost(id);
            if (post == null) return NotFound();
            if (post.author.id != userId) return Unauthorized();

            try
            {
                var fixFile = post.thumbnail.Substring(post.thumbnail.LastIndexOf('/'));
                fixFile = $"Thumbnails/{fixFile}";
                System.IO.File.Delete(fixFile);
            }
            catch { }

            var result = await _postsService.DeletePost(id, userId);
            if (result) return Ok();

            return Forbid();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Index (
            [FromForm] string title,
            [FromForm] string content,
            [FromForm] IFormFile thumbnail
        )
        {
            if (string.IsNullOrWhiteSpace(title)
                || string.IsNullOrWhiteSpace(content))
                return BadRequest();

            if (title.Length > 50)
                return BadRequest();

            var userId = this.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var filePath = $"Thumbnails/{Path.GetRandomFileName()}";
            filePath += Path.GetExtension(thumbnail.FileName);

            using (FileStream fs = new FileStream(filePath, FileMode.CreateNew))
                await thumbnail.CopyToAsync(fs);

            var user = await _userService.GetUserById(userId);
            var post = new Post
            {
                views = 0,
                title = title,
                content = content,
                thumbnail = $"/{filePath.ToLower()}",
                created_at = DateTime.UtcNow,
                author = new Post.Author()
                {
                    id = userId,
                    username = user.username
                }
            };

            await _postsService.CreatePost(post);

            return Json(post);
        }
    }
}
