import React from "react";
import ReactDOM from "react-dom";
/**
 * @template T
 * @typedef {[string]|[string,(t:T)=>Promise<boolean>?]} Success
 *
 */

/**
 *
 * @typedef {[string]} Close
 */

/**
 *  @template T
 *  @typedef {(param:{success?:Success<T>;close?:Close;props:{}})=>Promise<[false]|[true,T]>} FunctionalizedComponent
 */

/**
 * @template T
 * @param {React.Component} ModalLikeComponent
 * @returns {FunctionalizedComponent<T>}
 */
const functionalize = (ModalLikeComponent) => {
  /**
   * @template T
   * @param {{success:Success<T>;close:Close;props:{}}} prop
   */
  const resFn = ({ success, close, props }) => {
    return new Promise((resolve) => {
      const div = document.createElement("div");
      document.body.appendChild(div);
      const onSuccess = async (t) => {
        const manuallyHandleFn = success[1];
        if (!manuallyHandleFn) {
          resolve([true, t]);
          onClose();
          return;
        }
        const res = await manuallyHandleFn(t);
        if (!res) {
          return;
        }
        // resolve this Promise,  release memory
        resolve([true, t]);
        onClose();
      };

      const onClose = (...args) => {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
          div.parentNode.removeChild(div);
        }
        resolve([false]);
      };

      const renderProps = {
        [success[0]]: onSuccess,
        [close[0]]: onClose,
        ...props,
      };

      function render() {
        /**
         * https://github.com/ant-design/ant-design/issues/23623
         *
         * Sync render blocks React event. Let's make this async.
         */
        setTimeout(() => {
          ReactDOM.render(<ModalLikeComponent {...renderProps} />, div);
        });
      }
      render();
    });
  };
  return resFn;
};

export default functionalize;
