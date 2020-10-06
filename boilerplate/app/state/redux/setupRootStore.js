import configureStore from './configureStore'
import reducers from './reducers'
import rootSaga from './sagas'
import { useReactotron } from '../config/env'
import { combineReducers } from 'redux'

/* ------------- Assemble The Reducers ------------- */
export const rootReducer = combineReducers(reducers)

export default () => {
  const reactotron = useReactotron ? new Reactotron() : null
  let { store, sagasManager, sagaMiddleware } = configureStore(
    rootReducer,
    rootSaga,
    { useReactotron }
  )

  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./reducers').default)

      const newYieldedSagas = require('./sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas)
      })
    })
  }

  return { store, reactotron }
}
