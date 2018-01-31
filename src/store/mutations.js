import * as types from './mutation-type'

 const matutaions = {
    [types.SET_SINGER](state,singer){
        state.singer = singer;
    }
}
export default matutaions;