export const PLAY = "PLAY";
export const PAUSE = "PAUSE";
export const STOP = "STOP";

export const SET_STEP = "SET_STEP";
export const SET_SECONDS_PER_IMAGE = "SET_SECONDS_PER_IMAGE";
export const SET_IMAGE_COUNT = "SET_IMAGE_COUNT";

export const SET_IMAGE_INDEX = "SET_IMAGE_INDEX";
export const STEP_FORWARD = "STEP_FORWARD";
export const STEP_BACK = "STEP_BACK";
export const GO_FORWARD = "GO_FORWARD";
export const GO_BACK = "GO_BACK";

interface IImageQCActionBase<T> {
  type: T;
}
interface IImageQCActionWithPayload<T, P = never>
  extends IImageQCActionBase<T> {
  payload: P;
}

type ActionPlay = IImageQCActionBase<typeof PLAY>;
type ActionPause = IImageQCActionBase<typeof PAUSE>;
type ActionStop = IImageQCActionBase<typeof STOP>;
type ActionSetStep = IImageQCActionWithPayload<typeof SET_STEP, number>;
type ActionSetSecondsPerImage = IImageQCActionWithPayload<
  typeof SET_SECONDS_PER_IMAGE,
  number
>;
type ActionSetImageCount = IImageQCActionWithPayload<
  typeof SET_IMAGE_COUNT,
  number
>;
type ActionSetImageIndex = IImageQCActionWithPayload<
  typeof SET_IMAGE_INDEX,
  number
>;
type ActionStepForward = IImageQCActionBase<typeof STEP_FORWARD>;
type ActionStepBack = IImageQCActionBase<typeof STEP_BACK>;
type ActionForward = IImageQCActionBase<typeof GO_FORWARD>;
type ActionBack = IImageQCActionBase<typeof GO_BACK>;

export type ImageQCActions =
  | ActionPlay
  | ActionPause
  | ActionStop
  | ActionSetStep
  | ActionSetSecondsPerImage
  | ActionSetImageCount
  | ActionSetImageIndex
  | ActionStepForward
  | ActionStepBack
  | ActionForward
  | ActionBack;
