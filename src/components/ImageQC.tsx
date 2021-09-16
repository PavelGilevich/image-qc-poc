import { InputNumber, Spin } from "antd";
import React, { useReducer } from "react";
import "./ImageQC.scss";
import ImageQCControls from "./ImageQCControls";
import imageQCReducer, { initialState } from "./imageQCReducer";
import {
  SET_IMAGE_COUNT,
  SET_SECONDS_PER_IMAGE,
  SET_STEP,
} from "./imageQCReducer/actionTypes";
import usePlaybackManager from "./usePlaybackManager";

const MAX_IMAGES_CNT = 70000;

const ImageQC: React.FC = () => {
  const reducerResult = useReducer(imageQCReducer, initialState);

  const {
    imageStatus,
    isPreloading,
    onPlay,
    onPause,
    onStop,
    onForward,
    onStepForward,
    onBackward,
    onStepBackward,
  } = usePlaybackManager(reducerResult);

  const [state, dispatch] = reducerResult;

  const getImageBoxContent = () => {
    if (!imageStatus)
      return <span className="help-msg">No image available</span>;

    if (state.isStopped) {
      return <span className="help-msg">'Press "Play" to start'</span>;
    }
    const { loading, error, url } = imageStatus;
    if (loading) return <Spin />;
    if (error || !url)
      return (
        <span className="help-msg">
          Some error happened during loading an image
        </span>
      );

    return <img src={url} alt="img" />;
  };

  return (
    <div>
      <div className="parameters">
        <div>
          Step:{" "}
          <InputNumber
            disabled={!state.isStopped}
            value={state.step}
            min={1}
            step={1}
            max={50}
            onChange={(payload) => dispatch({ type: SET_STEP, payload })}
          />
        </div>
        <div>
          Seconds per image:{" "}
          <InputNumber
            disabled={!state.isStopped}
            value={state.secondsPerImage}
            min={0.1}
            step={0.1}
            max={1}
            onChange={(payload) =>
              dispatch({ type: SET_SECONDS_PER_IMAGE, payload })
            }
          />
        </div>
        <div>
          Image count:{" "}
          <InputNumber
            disabled={!state.isStopped}
            value={state.imageCount}
            min={0}
            max={MAX_IMAGES_CNT}
            step={1000}
            onChange={(payload) => dispatch({ type: SET_IMAGE_COUNT, payload })}
          />
        </div>
      </div>
      <div className="image-box">{getImageBoxContent()}</div>
      <ImageQCControls
        isPlaying={state.isPlaying}
        isPreloading={isPreloading}
        isStopped={state.isStopped}
        onBackward={onBackward}
        onStepBackward={onStepBackward}
        onForward={onForward}
        onStepForward={onStepForward}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
      />
      Image num:{" "}
      <>
        {state.imageIndex + 1} / {state.imageCount}
      </>
    </div>
  );
};

export default ImageQC;
