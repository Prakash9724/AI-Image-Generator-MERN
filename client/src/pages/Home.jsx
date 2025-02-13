import React, { useEffect, useState } from "react";
import { Loader, Card, FormField } from "../components";
import ImageModal from '../components/ImageModal';

const RenderCards = ({ data, title, onImageClick }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <Card 
        key={post._id} 
        {...post} 
        onClick={() => onImageClick(post.photo)}
      />
    ));
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
//https://ai-image-generator-oeoi.onrender.com/api/v1/post
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
      const response = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3.5-large/api/v1/post", {
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

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
                <RenderCards 
                  data={searchedResult} 
                  title="No search results found" 
                  onImageClick={handleImageClick}
                />
              ) : (
                <RenderCards 
                  data={allPost} 
                  title="no post found" 
                  onImageClick={handleImageClick}
                />
              )}
            </div>
          </>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={selectedImage}
      />
    </section>
  );
};

export default Home;
