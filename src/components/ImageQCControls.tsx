import { Button } from "antd";
import {
  BackwardOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  PauseOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import StopIcon from "./StopIcon";
import React from "react";

interface IProps {
  isPlaying: boolean;
  isPreloading: boolean;
  isStopped: boolean;
  onBackward: () => void;
  onStepBackward: () => void;
  onForward: () => void;
  onStepForward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}
const ImageQCControls: React.FC<IProps> = ({
  isPlaying,
  isPreloading,
  isStopped,
  onBackward,
  onStepBackward,
  onForward,
  onStepForward,
  onPlay,
  onPause,
  onStop,
}) => {
  return (
    <div className="image-qc-controls">
      <Button
        disabled={isPlaying || isStopped}
        onClick={onStepBackward}
        icon={<BackwardOutlined />}
        type="primary"
        shape="round"
      />
      <Button
        disabled={isPlaying || isStopped}
        onClick={onBackward}
        icon={<LeftOutlined />}
        type="primary"
        shape="round"
      />
      <Button
        onClick={isPlaying ? onPause : onPlay}
        icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
        loading={isPreloading}
        type="primary"
        shape="round"
      />
      <Button
        disabled={isStopped}
        onClick={onStop}
        icon={<StopIcon />}
        type="primary"
        shape="round"
      />
      <Button
        disabled={isPlaying || isStopped}
        onClick={onForward}
        icon={<RightOutlined />}
        type="primary"
        shape="round"
      />
      <Button
        disabled={isPlaying || isStopped}
        onClick={onStepForward}
        icon={<ForwardOutlined />}
        type="primary"
        shape="round"
      />
    </div>
  );
};

export default ImageQCControls;
