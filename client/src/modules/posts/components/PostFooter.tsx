interface PostFooterProps {
  count: number;
  imgSrc: string;
  alt: string;
}

const PostFooter = (props: PostFooterProps) => {
  return (
    <div className="small-medium flex cursor-pointer items-center gap-x-1">
      <img src={props.imgSrc} alt={props.alt} />
      <p>{props.count}</p>
    </div>
  );
};

export default PostFooter;
