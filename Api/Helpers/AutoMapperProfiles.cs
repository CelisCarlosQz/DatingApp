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
            CreateMap<PhotoForRegisterDTO, Photos>();

            CreateMap<UserForRegisterDTO, Users>(); // .Map<Users>(userForRegisterDTO)

            CreateMap<MessageForCreateDTO, Messages>().ReverseMap(); // So It Works The Other Way Around

            CreateMap<Messages, MessageToReturnDTO>()
                .ForMember(d => d.SenderPhotoUrl, opt => opt.MapFrom(u => 
                    u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.RecipientPhotoUrl, opt => opt.MapFrom(u => 
                    u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<Users, UserToLoginDTO>()
                .ForMember(dest => dest.PhotoUrl, src => src.MapFrom(p => p.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}
