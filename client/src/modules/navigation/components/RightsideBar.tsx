const popularTags = [
  { _id: "1", name: "JavaScript", count: 120 },
  { _id: "2", name: "React", count: 95 },
  { _id: "3", name: "Node.js", count: 80 },
  { _id: "4", name: "CSS", count: 70 },
  { _id: "5", name: "HTML", count: 60 },
];

const RightsideBar = () => {
  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-75 flex-col gap-6 overflow-y-auto border-l border-l-gray-300 p-6 pt-36 max-xl:hidden">
      <div>
        <h3 className="h3-bold">Top Tags</h3>

        <div className="mt-7 flex w-full flex-col gap-7.5">
          {popularTags.map((tag) => (
            <div key={tag._id} className="flex items-center justify-between gap-7">
              <div className="flex flex-col items-start gap-1">
                <p className="body-regular">#{tag.name}</p>
                <span className="subtle-regular">{tag.count} posts</span>
              </div>

              <p className="small-medium flex items-center justify-center rounded-md bg-[#F1F1F1] px-5 py-1">
                Trending
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightsideBar;
