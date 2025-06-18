import React, { useState } from "react";

const Button: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
	<button
	  aria-pressed={isPressed}
	  onClick={() => setIsPressed((prev) => !prev)}
	>
	  GÉNÉRER MON MVP
	</button>
  );
};

export default Button;