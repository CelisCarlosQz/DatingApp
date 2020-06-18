using System.Linq;
using Api.DTOs;
using Api.Models;
using AutoMapper;

namespace Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Users, UsersListDTO>()
                .ForMember(dest => dest.Age,
                    src => src.MapFrom(p => p.DateofBirth.CalculateAge()))
                .ForMember(dest => dest.PhotoUrl,
                    src => src.MapFrom(p => p.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Users, UserDetailDTO>()
                .ForMember(dest => dest.Age,
                    src => src.MapFrom(p => p.DateofBirth.CalculateAge()))
                .ForMember(dest => dest.PhotoUrl,
                    src => src.MapFrom(p => p.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Photos, PhotosDetailsDTO>();
            CreateMap<UserForUpdateDTO, Users>(); // Maps Only The Variables At UserForUpdateDTO

            CreateMap<Photos, PhotoToReturnDTO>();
            CreateMap<PhotoForUploadDTO, Photos>();

            CreateMap<Users, UserToLoginDTO>()
                .ForMember(dest => dest.PhotoUrl, src => src.MapFrom(p => p.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}
