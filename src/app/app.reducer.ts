export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading:false
};

// @ts-ignore
export function appReducer (state=initialState, action){
  switch (action.type){
    case 'START_LOADING':
      return{
        isLoading:true
      };
    case 'STOP_LOADING':
      return {
        isLoading: false
      };
    default:
      return state ;
  }
}
