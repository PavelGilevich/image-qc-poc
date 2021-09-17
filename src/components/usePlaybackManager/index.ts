import React, { useCallback, useRef, useState } from "react";
import { ImgBlobStatus } from "../../types";
import { IImageQCState } from "../imageQCReducer";
import {
  ImageQCActions,
  STEP_FORWARD,
  PAUSE,
  PLAY,
  STEP_BACK,
  SET_IMAGE_INDEX,
  STOP,
  GO_FORWARD,
  GO_BACK,
} from "../imageQCReducer/actionTypes";
import ImageStorage from "../../utils/ImageStorage";

const INITIAL_PRELOAD_SECONDS = 10;
const PLAYBACK_PRELOAD_SECONDS = 5;

type TPlaybackManagerProps = [IImageQCState, React.Dispatch<ImageQCActions>];

type TPlaybackManagerReturnValue = {
  imageStatus: ImgBlobStatus | null;
  isPreloading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onForward: () => void;
  onStepForward: () => void;
  onBackward: () => void;
  onStepBackward: () => void;
};

export default function usePlaybackManager(
  props: TPlaybackManagerProps
): TPlaybackManagerReturnValue {
  const [state, dispatch] = props;

  const [isPreloading, setIsPreloading] = useState(false);
  const [currentImageStatus, setCurrentImageStatus] =
    useState<ImgBlobStatus | null>(null);

  const imageIndexRef = useRef(state.imageIndex);
  const intervalIdRef = useRef(0);

  const {
    isPlaying,
    isStopped,
    step,
    secondsPerImage,
    imageIndex,
    imageCount,
  } = state;

  const isPaused = !isPlaying && !isStopped;
  const isPlaybackInProgress = !!intervalIdRef.current;
  const bunchSize = Math.round(INITIAL_PRELOAD_SECONDS / secondsPerImage);
  const preloadOffset = Math.round(PLAYBACK_PRELOAD_SECONDS / secondsPerImage);

  imageIndexRef.current = imageIndex;

  const goToImage = useCallback(
    (index: number) => {
      dispatch({ type: SET_IMAGE_INDEX, payload: index });
    },
    [dispatch]
  );

  const onForward = () => {
    dispatch({ type: GO_FORWARD });
  };

  const onStepForward = useCallback(() => {
    dispatch({ type: STEP_FORWARD });
  }, [dispatch]);

  const onBackward = () => {
    dispatch({ type: GO_BACK });
  };

  const onStepBackward = () => {
    dispatch({ type: STEP_BACK });
  };

  const startPlayback = useCallback(() => {
    const id = setInterval(() => {
      onStepForward();
    }, secondsPerImage * 1000);
    intervalIdRef.current = +id;
  }, [secondsPerImage, onStepForward]);

  const stopPlayback = useCallback(() => {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = 0;
  }, []);

  const onPlay = async () => {
    if (!isPlaying) {
      setIsPreloading(true);
      await loadImage(imageIndex, step, bunchSize);
      setIsPreloading(false);
    }
    dispatch({ type: PLAY });
    startPlayback();
  };

  const onStop = () => {
    dispatch({ type: STOP });
    stopPlayback();
  };

  const onPause = useCallback(() => {
    dispatch({ type: PAUSE });
    stopPlayback();
  }, [dispatch, stopPlayback]);

  const onImageLoaded = useCallback(
    (status: ImgBlobStatus, index: number) => {
      if (index === imageIndexRef.current) {
        setCurrentImageStatus(status);
        if (isPlaying && !intervalIdRef.current) {
          startPlayback();
        }
      }
    },
    [isPlaying, startPlayback]
  );

  const loadImage = useCallback(
    (
      idx: number,
      step: number,
      size: number,
      cb?: (status: ImgBlobStatus, index: number) => void
    ) => {
      return ImageStorage.loadImagesByIndex(
        idx,
        step,
        size,
        cb ? cb : onImageLoaded
      );
    },
    [onImageLoaded]
  );

  const loadNextChunkIfNeeded = useCallback(
    (currentIdx: number) => {
      const offsetIndex = currentIdx + preloadOffset * step;
      if (ImageStorage.imageNeedsLoading(offsetIndex)) {
        return loadImage(offsetIndex, step, bunchSize);
      }
    },
    [preloadOffset, step, bunchSize, loadImage]
  );

  React.useEffect(() => {
    if (!isPlaying) return;
    const nextIndex = imageIndex + step;
    if (nextIndex >= imageCount) {
      onPause();
      goToImage(imageCount - 1);
    }
  }, [imageIndex, step, imageCount, isPlaying, onPause, goToImage]);

  /**
   * Load next images chunk during playback
   */
  React.useEffect(() => {
    if (!isPlaying) return;
    loadNextChunkIfNeeded(imageIndex);
  }, [imageIndex, isPlaying, loadNextChunkIfNeeded]);

  /**
   * Load one image when switching images on PAUSE
   */
  React.useEffect(() => {
    if (!isPaused) return;
    if (ImageStorage.imageNeedsLoading(imageIndex)) {
      loadImage(imageIndex, 1, 1);
    }
  }, [imageIndex, isPaused, loadImage]);

  /**
   * Update current image status
   */
  React.useEffect(() => {
    setCurrentImageStatus(ImageStorage.getImageAtIndex(imageIndex));
  }, [imageIndex]);

  /**
   * If image is not loaded yet, pause playback
   */
  React.useEffect(() => {
    const imageIsLoaded = currentImageStatus && !currentImageStatus.loading;
    if (intervalIdRef.current && !imageIsLoaded) {
      stopPlayback();
    }
  }, [currentImageStatus, isPlaybackInProgress, stopPlayback]);

  return {
    imageStatus: currentImageStatus,
    isPreloading,
    onStop,
    onPlay,
    onPause,
    onForward,
    onStepForward,
    onBackward,
    onStepBackward,
  };
}
