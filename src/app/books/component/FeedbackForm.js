import { useContext, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "next/navigation";

const FeedbackForm = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!rating || !reviewText) {
      setLoading(false);
      return toast.error("Polia pre hodnotenie a recenziu sú povinné.");
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book:id, user:userId, rating, reviewText }),
      });
  
      if (!res.ok) {
        throw new Error("Nepodarilo sa odoslať recenziu, treba sa prihlásiť.");
      }
  
      const result = await res.json();
      toast.success(result.message || "Recenzia bola úspešne odoslaná.");
  
     
      setRating(0);
      setHover(0);
      setReviewText("");


      setTimeout(() => {
        window.location.reload();
      }, 1000); 
  
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <form action="">
        <div>
          <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Ako by ste hodnotili celkovú skúsenosť?*
          </h3>
          <div>
            {[...Array(5).keys()].map((_, index) => {
              index += 1;

              return (
                <button
                    key={index}
                    type="button"
                    className={`${
                        index <= (hover || rating) ? "text-yellowColor" : "text-gray-400"
                    } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                    onDoubleClick={() => {
                        setHover(0);
                        setRating(0);
                    }}
                    >
                    <span>
                        <AiFillStar />
                    </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-[30px]">
          <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Napíšte nám svoju spätnú väzbu a nápady na zlepšenie*
          </h3>
          <textarea
            className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full 
            px-4 py-3 rounded-md"
            rows="5"
            placeholder="Napísať komentár"
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" onClick={handleSubmitReview} className="btn">
          {loading ? <HashLoader size={25} color="#fff" /> : "Odoslať spätnú väzbu"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;