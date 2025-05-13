import {useState} from "react";
import {motion} from "framer-motion";
import"../../styles/TarotCard.css";

function TarotCard({result}) {
    const [isFlipped, setFlipped] = useState(false);

    const handleClick = () => {
        setFlipped( !isFlipped );
    };

    return (
        <div className="tarot-page">
            <h1> 🔮 오늘의 타로 운세 🔮 </h1>

            <motion.div
                className="card-container"
                onClick={() => setFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}  // 클릭 시 Y축으로 회전
                transition={{duration: 0.8}}
            >
                    <div className="card">
                        <div className="card-front"> 타로 뒷면 </div>
                        <div className="card-back"> 오늘의 운세 : 행운! </div>
                    </div>
            </motion.div>
            <motion.div
                className="card-container"
                onClick={() => setFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}  // 클릭 시 Y축으로 회전
                transition={{duration: 0.8}}
            >
                    <div className="card">
                        <div className="card-front"> 타로 뒷면 </div>
                        <div className="card-back"> 오늘의 운세 : 행운! </div>
                    </div>
            </motion.div>
            
        </div>
    );
}

export default TarotCard;