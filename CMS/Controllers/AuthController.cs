using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;

using CMS.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace CMS.Controllers
{
    [EnableCors("default")]
    public class AuthController : Controller
    {
        protected readonly UserService _userService;

        public AuthController(UserService userService)
        {
            _userService = userService;
        }

        // Controller Internal Structs
        public struct UserLoginInput
        {
            public string user;
            public string password;
        }

        public struct UserRegisterInput
        {
            public string email;
            public string username;
            public string password;
        }

        // Controller Internal Functions

        // Email validation using c#'s mail package (docs)
        private bool ValidateEmail(string email)
        {
            try
            {
                return (new MailAddress(email)).Address == email;
            }
            catch
            {
                return false;
            }
        }

        private async Task CreateLoginSession(User user)
        {
            // We only want to store the Id, since we generated the cookie,
            // it'll always be right
            var claimsIdentity = new ClaimsIdentity(
                new List<Claim>
                {
                    new Claim("Id", user._id)
                }, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProps = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(1),
                IssuedUtc = DateTimeOffset.UtcNow
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity), authProps);
        }

        private async Task<Tuple<bool, User>> AuthUser(string userInfo, string password)
        {
            var user = await _userService.GetUserByUserOrEmail(userInfo);
            if (user != null)
                if (BCrypt.Net.BCrypt.Verify(password, user.password))
                    return new Tuple<bool, User>(true, user);

            return new Tuple<bool, User>(false, null);
        }

        private async Task CreateUser(string username, string email, string password)
        {
            var userResult = await _userService.GetUserByUserOrEmail(username);
            if (userResult != null)
                throw new Exception("username already exists");

            userResult = await _userService.GetUserByUserOrEmail(email);
            if(userResult != null)
                    throw new Exception("email already exists");

            var user = new User
            {
                username = username,
                email = email,
                password = 
                    BCrypt.Net.BCrypt.HashPassword(password, SaltRevision.Revision2B),
                created_at = DateTime.UtcNow
            };

            await _userService.CreateUser(user);
            await CreateLoginSession(user);
        }


        // Controller Actions

        public IActionResult Index()
        {
            return Ok(new { Timestamp = DateTime.UtcNow, Status = "OK" });
        }

        [HttpPost]
        public async Task<ActionResult> Login (
            [FromBody] UserLoginInput userInput
        )
        {
            if (string.IsNullOrWhiteSpace(userInput.user) || string.IsNullOrWhiteSpace(userInput.password))
                return BadRequest("empty user or password");

            var authResponse = await AuthUser(userInput.user, userInput.password);

            if (authResponse.Item1 && authResponse.Item2 != null)
            {
                await CreateLoginSession(authResponse.Item2);
                return Ok();
            }
            

            return StatusCode(401, "invalid user or password");
        }

        public async Task<ActionResult> Register (
            [FromBody] UserRegisterInput userInput
        )
        {
            if (string.IsNullOrWhiteSpace(userInput.email)
                || string.IsNullOrWhiteSpace(userInput.username)
                || string.IsNullOrWhiteSpace(userInput.password))
                return StatusCode(400, "email/username/password are empty");

            if (!userInput.username.All(char.IsLetterOrDigit))
                return StatusCode(400, "username has to be alphanumeric");

            if (!ValidateEmail(userInput.email))
                return StatusCode(400, "email is not valid");

            try
            {
                await CreateUser(userInput.username, userInput.email,
                    userInput.password);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(401, ex.Message);
            }
        }
    }
}
