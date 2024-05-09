const SkillRenderer = ({
  name,
  selfRating,
  peerRating,
  verifications,
}: {
  name: string;
  selfRating: number;
  peerRating: number;
  verifications: number;
}) => {
  // Calculate the average rating
  const avgRating = (selfRating + peerRating) / 2;

  // Function to render stars based on the rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars === 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    const stars = [];

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-500">
          &#9733;
        </span>,
      );
    }

    // Render half star if necessary
    if (halfStar === 1) {
      stars.push(
        <span key="half" className="text-yellow-500">
          &#9733;&#189;
        </span>,
      );
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={i + fullStars + halfStar} className="text-gray-300">
          &#9733;
        </span>,
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center">
      <div>{name}</div>
      <div>Self Rating: {selfRating}</div>
      <div>Peer Rating: {peerRating}</div>
      <div>Number of Verifications: {verifications}</div>
      <div>Average Rating: {renderStars(avgRating)}</div>
    </div>
  );
};

export default SkillRenderer;
