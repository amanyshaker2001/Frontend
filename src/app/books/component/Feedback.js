import { useState } from 'react';
import { AiFillStar, AiOutlineUser } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';

const Feedback = ({ reviews, totalRating }) => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div>
            <div className='mb-[50px]'>
                <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
                    Recenzie ({totalRating})
                </h4>
                {reviews?.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className='flex justify-between gap-10 mb-[30px]'>
                            <div className='flex gap-3'>
                            <figure className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
                                <AiOutlineUser className="w-6 h-6 text-gray-500" />
                            </figure>
                                <div>
                                    <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>
                                        {review?.user?.name || "anonymné"}
                                    </h5>
                                    <p className='text-[14px] leading-6 text-textColor'>
                                        {formatDate(review?.createdAt)}
                                    </p>
                                    <p className='text_para mt-3 font-medium text-[15px]'>
                                        {review.reviewText}
                                    </p>
                                </div>
                            </div>

                            <div className='flex gap-1'>
                                {[...Array(review?.rating).keys()].map((_, index) => (
                                    <AiFillStar key={index} color='#0067FF'/>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nie sú zatiaľ žiadne recenzie.</p>
                )}
            </div>

            {!showFeedbackForm && (
                <div className='text-center'>
                    <button className='btn' onClick={() => setShowFeedbackForm(true)}>
                        Napísať recenziu
                    </button>
                </div>
            )}

            {showFeedbackForm && <FeedbackForm />}
        </div>
    );
};

export default Feedback;
