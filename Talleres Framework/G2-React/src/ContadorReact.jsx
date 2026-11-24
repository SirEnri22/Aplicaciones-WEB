const { useState } = React;

function BotonMeGusta() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Me gusta (React): {likes}
    </button>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BotonMeGusta />);