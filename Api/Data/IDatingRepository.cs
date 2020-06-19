using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Helpers;
using Api.Models;

namespace Api.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class; // T can be User or Photo...
        void Delete<T>(T entity) where T:class;
        Task<bool> SaveAll();
        Task<Users> GetUser(int id);
        Task<PageListed<Users>> GetUsers(UserParams userParams);
        Task<Photos> GetPhoto(int id);
        Task<Photos> GetMainPhoto(int id);

        Task<Likes> GetLike(int userId, int recipientId);
    }
}