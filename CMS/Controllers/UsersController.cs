using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS.Services;
using Microsoft.AspNetCore.Cors;

namespace CMS.Controllers
{
    [Route("api/users")]
    [EnableCors("default")]
    public class UsersController : Controller
    {
        private UserService _userService;

        public UsersController(
            UserService userService    
        )
        {
            _userService = userService;
        }

        // Methods
        [HttpGet]
        public async Task<ActionResult> Index (
            [FromQuery] int start = 0,
            [FromQuery] int limit = 20
        )
        {
            if (start < 0)
                return BadRequest("Start cannot be negative");
            if (limit < 0)
                return BadRequest("Limit cannot be negative");
            if (limit > 100)
                return BadRequest("Limit cannot be greater than 100");

            return Json(new
            {
                totalCount = await _userService.GetTotalUsers(),
                data = await _userService.GetUsers(start, limit)
            });
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetUser(
            string id
        )
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest("Invalid id");

            var user = await _userService.GetLimitedUserById(id);
            if (user == null) return NotFound();

            return Json(user);
        }
    }
}
