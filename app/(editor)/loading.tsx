import { IconFidgetSpinner } from "@tabler/icons-react";

const Loading = () => {
  return (
    <div>
      <div>
        <IconFidgetSpinner className=" animate-spin" />
      </div>
      <div>LOADING</div>
    </div>
  );
};

export default Loading;
