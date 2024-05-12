import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfAlt, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StarRating = ({ score, color }: { score: number; color: string }) => {
  const fullStars = Math.floor(score);
  const decimalStar = score - fullStars;
  const emptyStars = 5 - fullStars - (decimalStar > 0 ? 1 : 0);

  return (
    <div className="star-rating flex">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={solidStar} color={color} />
      ))}
      {decimalStar > 0 && <FontAwesomeIcon icon={faStarHalfAlt} color={color} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesomeIcon key={fullStars + i + 1} icon={regularStar} color={color} />
      ))}
    </div>
  );
};

export default StarRating;
