import React, { useEffect, useState } from "react";
import { Loader, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, SetLoading] = useState(false);
  const [allPost, SetAllPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedResult, setsearchedResult] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setsearchTimeout(
      setTimeout(() => {
        const searchResult = allPost.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLocaleLowerCase())
        );
        setsearchedResult(searchResult);
      }, 500)
    );
  };

  const fetchPosts = async () => {
    SetLoading(true);

    try {
      const response = await fetch("https://ai-image-generator-oeoi.onrender.com/api/v1/post", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();

        SetAllPost(result.data.reverse());
      }
    } catch (error) {
      alert(error);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse a collection of imaginative and visually stunnuing images
          genrated by DALL-E AI
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search Something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75]">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={searchedResult} title="No search results found" />
              ) : (
                <RenderCards data={allPost} title="no post found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;