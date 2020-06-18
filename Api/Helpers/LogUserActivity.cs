using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Api.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next(); // Await Until Action Has Been Completed
            var userdId = Int32.Parse(resultContext.HttpContext.User.FindFirst( // Id From Token
                ClaimTypes.NameIdentifier).Value);
            var _datingRepository = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await _datingRepository.GetUser(userdId);
            user.LastActive = DateTime.Now;
            await _datingRepository.SaveAll();
        }
    }
}
