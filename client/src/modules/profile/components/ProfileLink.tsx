interface ProfileLinkProps {
  imgUrl: string;
  title: string | number;
}

const ProfileLink = ({ imgUrl, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <img src={imgUrl} alt={imgUrl} width={20} height={20} />
      <span className="paragraph-medium">{title}</span>
    </div>
  );
};

export default ProfileLink;
