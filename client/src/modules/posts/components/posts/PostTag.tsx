interface TagProps {
  label: string;
  isDeletable: boolean;
  removeTag: (label: string) => void;
}

const PostTag = ({ label, isDeletable, removeTag }: TagProps) => {
  return (
    <div>
      <p className={`subtle-regular flex-center text-blac gap-x-2.5 rounded-xl bg-[#ececec] px-2 py-1`}>
        {label}
        {isDeletable && (
          <button onClick={() => removeTag(label)} className="small-semibold mb-[0.5px] cursor-pointer text-[#618a81]">
            x
          </button>
        )}
      </p>
    </div>
  );
};

export default PostTag;
