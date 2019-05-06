using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Misc
{
    public static class UserHelper
    {
        public static string GetCurrentUserId(this Controller ctrl)
        {
            if (!ctrl.User.Identity.IsAuthenticated)
                return null;

            var userId = ctrl.User.FindFirst("id")
                .Value ?? null;

            if (userId == null || userId.Equals(default(string)))
                return null;

            return userId;
        }
    }
}
