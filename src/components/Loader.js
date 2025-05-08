import { Oval } from "react-loader-spinner";

const Loader = (props) => {
  return (
    <Oval visible={props.visible} height={41} width={41} color="#00BFFF" /> // other options
  );
};

export default Loader;
