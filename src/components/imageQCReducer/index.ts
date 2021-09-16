import {
  PLAY,
  PAUSE,
  STOP,
  SET_STEP,
  SET_IMAGE_COUNT,
  SET_IMAGE_INDEX,
  SET_SECONDS_PER_IMAGE,
  ImageQCActions,
  STEP_FORWARD,
  STEP_BACK,
  GO_FORWARD,
  GO_BACK,
} from "./actionTypes";

export interface IImageQCState {
  step: number;
  secondsPerImage: number;
  imageCount: number;

  imageIndex: number;

  isPlaying: boolean;
  isStopped: boolean;
}

function imageQCReducer(
  state: IImageQCState,
  action: ImageQCActions
): IImageQCState {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        isPlaying: true,
        isStopped: false,
      };
    case PAUSE:
      return { ...state, isPlaying: false, isStopped: false };
    case STOP:
      return { ...state, isPlaying: false, isStopped: true, imageIndex: 0 };
    case SET_STEP:
      return { ...state, step: action.payload };
    case SET_SECONDS_PER_IMAGE:
      return { ...state, secondsPerImage: action.payload };
    case SET_IMAGE_COUNT:
      return { ...state, imageCount: action.payload };
    case SET_IMAGE_INDEX:
      return { ...state, imageIndex: action.payload };
    case STEP_FORWARD: {
      const nextIndex = state.imageIndex + state.step;
      if (nextIndex >= state.imageCount) return state;
      return { ...state, imageIndex: nextIndex };
    }
    case GO_FORWARD: {
      const nextIndex = state.imageIndex + 1;
      if (nextIndex >= state.imageCount) return state;
      return { ...state, imageIndex: nextIndex };
    }
    case GO_BACK: {
      const prevIndex = state.imageIndex - 1;
      if (prevIndex < 0) return state;
      return { ...state, imageIndex: prevIndex };
    }
    case STEP_BACK: {
      const prevIndex = state.imageIndex - state.step;
      if (prevIndex < 0) return state;
      return { ...state, imageIndex: prevIndex };
    }
    default:
      return state;
  }
}

export default imageQCReducer;

export const initialState: IImageQCState = {
  step: 1,
  secondsPerImage: 1,
  imageCount: 1000,
  imageIndex: 0,
  isPlaying: false,
  isStopped: true,
};
