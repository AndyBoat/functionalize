# func-modal.js: Functionalize Your Modal

##  Functionalize Your Modal [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`func-modal.js` try to meet one and only one goal:

**use your modal just like function.**



## TBD

- [ ] make dist and npm package usable
- [ ] add test case 
- [ ] use typescript refactor
- [ ] remove dependency of React version 



## Online Sample
codesandbox: [functionalize-with-modal](https://codesandbox.io/s/functionalize-with-modal-sample-ybjcy?file=/src/App.js)

![image.png](https://i.loli.net/2021/06/29/2XRYsQNPC1Wh9xV.png)





## Installation

```shell
npm install --save functionalize
```



## Base example

given a base modal ,  it will jump out and ask the user to choose `Yes` or `No`,  and  like always user could  click  the icon to close the modal.

```jsx
import React from "react";

/**
 * @param {Object} props
 * @param {(boolean)=>void} props.onConfirm
 * @param {()=>void} props.onCancel
 */
function ConfirmModal(props) {
  const { onConfirm, onCancel } = props;

  return (
    <div className={"gloabl-modal"}>
      <div className={"header"}>
        <title>Confirm Modal</title>
        <icon onClick={onCancel}>x</icon>
      </div>
      <div className={"body"}>
        <div>Do U Confirm ?</div>
      </div>
      <div className={"footer"}>
        <button onClick={() => onConfirm(true)}>Yes</button>
        <button onClick={() => onConfirm(false)}>No</button>
      </div>
    </div>
  );
}

```

in our project we want to reuse it in a `SomeComponent`.  With `func-modal.js`, we can avoid write anything like`  isConfirming && <ConfirmModal/>`  , instead we can write in a more efficieny way:

```jsx
import functionalize from "func-modal";
import React from "react";
import Request from "./src/request";
import ConfirmModal from "./src/components/confirm-modal";

const ConfirmModalFunc = functionalize(ConfirmModal);

function SomeComponent(props) {
  //...some other logic
 
  const onTryConfirm = async () => {
    const [isSuccess, isConfirm] = await ConfirmModalFunc({
      success: ["onConfirm"],
      close: ["onCancel"],
    });
    if (!isSuccess) {
      // the user cancel it, so just ignore it 
      return;
    }
    //the user has picked Yes or No, so we can do some businesss logic
    //in this example, we just submit it with our api 
    await Request.confirm({ isConfirm });
  };

  return (
    <div className={"some-class"}>
      <div className={"some-class-body"}></div>
      <button onClick={onTryConfirm}>Confirm</button>
    </div>
  );
}

export default SomeComponent;

```

See, we can just use a modal like an async funciton, and  get the result in a slice way: `[isSuccess, isConfirm]`.

`isSuccess`means wheter the user picked any choice. if `false`,  which is returned by `onCancel` , we can just `return`.

On the other way, when  `isSuccess` is `true`,  then we go ahead to business logic, handle the `isConfirmed`  value.





## Why functionalize

Look back to the exmaple above,  some programmer (like me before) may write like:

```jsx
import React, { useState } from "react";
import Request from "./src/request";
import ConfirmModal from "./src/components/confirm-modal";

function SomeComponent(props) {
  //...some other logic
  const [isConfirming, setIsConfirming] = useState(false);

  const onTryConfirm = async () => {
    setIsConfirming(true);
  };

  const onCancel = async (isConfirmed) => {
    setIsConfirming(false);
  };

  const onConfirm = async (isConfirmed) => {
    setIsConfirming(false);
    await Request.submitConfirm(isConfirmed);
  };

  return (
    <div className={"some-class"}>
      <div className={"some-class-body"}></div>
      <button onClick={onTryConfirm}>Confirm</button>
      {isConfirming && (
        <ConfirmModal onConfirm={onConfirm} onCancel={onCancel} />
      )}
    </div>
  );
}

export default SomeComponent;
```

You See,  to use this Modal, we create  one state , and three methods,  and only to get one result.

Less code is always better code.

Besides,  there is a worse but not obvious result: this   breaks one single logic apart into several methods.

First, we trigger `onTryConfirm` to show Modal; and then , we rely on another callback  `onConfirm`  to get result and handle result. At last , we create a `onCancel` method to clean `isConfirming` state .

With `SomeComponent` grows, these methods may split into different position in file.  And the developer must jump from one place to anthotr place to check this one single logic : get modal result and handle it .

It has not done yet.

What if there are more one one Modal in `SomeComponent` ?   This truly happens in my daily work.  We have to create multiple times of `xxxShowing`, `onXXXClose`,`onXXXSubmit` in `SomeComponent` , and multiple times of optional rendering in render method.

```jsx
import React, { useState } from "react";
import InputModalA from "./src/components/input-modal-A";
import InputModalB from "./src/components/input-modal-B";
import InputModalC from "./src/components/input-modal-C";

function SomeComponent(props) {
  //...some other logic
  const [isInputingA, setIsInputingA] = useState(false);
  const [isInputingB, setIsInputingB] = useState(false);
  const [isInputingC, setIsInputingC] = useState(false);

  const onTryInputA = async () => {
    setIsInputingA(true);
  };

  const onCancelA = async () => {
    setIsInputingA(false);
  };

  const onInputA = async (resultA) => {
    setIsInputingA(false);
    //... handle resultA
  };

  const onTryInputB = async () => {
    setIsInputingB(true);
  };

  const onCancelB = async () => {
    setIsInputingB(false);
  };

  const onInputB = async (resultB) => {
    setIsInputingB(false);
    //... handle resultB
  };
  const onTryInputC = async () => {
    setIsInputingC(true);
  };

  const onCancelC = async () => {
    setIsInputingC(false);
  };

  const onInputC = async (resultC) => {
    setIsInputingC(false);
    //... handle resultC
  };

  return (
    <div className={"some-class"}>
      <div className={"some-class-body"}></div>
      <button onClick={onTryInputA}>InputA</button>
      <button onClick={onTryInputB}>InputB</button>
      <button onClick={onTryInputC}>InputC</button>
      {isInputingA && <InputModalA onInput={onInputA} onCancel={onCancelA} />}
      {isInputingB && <InputModalB onInput={onInputB} onCancel={onCancelB} />}
      {isInputingC && <InputModalC onInput={onInputC} onCancel={onCancelC} />}
    </div>
  );
}

export default SomeComponent;

```

Its really a hell. And the real business logic is hidden in the duplication of modal control logic.

This situation is really like the `callback hell` before es6 release.  And its really important to make logic clean and independent.

With `func-modal`,  the Component the use the Modal dont need take care of modal showing state control, and dont need import modal render logic into render method.   

And with function, the logic is encapsulated into only one method. Developer can avoid jumpting in source code.





## API

The full param description to pass  into a funcitonliazed modal :

| field     | type               | description                                     | isOptional |
| --------- | ------------------ | ----------------------------------------------- | ---------- |
| `success` | [string,function?] | tell `func-modal` the name of sucess props      | No         |
| `close`   | [string]           | tell `func-modal` the name of close props       | No         |
| `props`   | Object             | any other props you want to pass into the Modal | Yes        |

Currently, `func-modal.js` only support these Modal which are hooked by success  method and close  method.  

- success method:  callback for submit result.
- close method: callback for close the modal.

Which means, you can use the Modal like  `<Moadl onSuccess={} onClose={} />` or  `<Moadl onConfirm={} onClose={} />` and anything else. 

We have so many property name to pick for these two method ,so you need tell `func-modal`  the key name of sucess callback prop and close methos prop, so `func-modal` will try decorate it  => create a `Promise` to proxy it.

And `func-modal` also support pass  props manually , but will not handled by `func-modal.js`  automatically. 

In a `typescript` way , it is like this:

```typescript
type SuccessKey = string
type CloseKey = string
type SuccessCallback<ModalRes> = (res: ModalRes) => Promise<boolean>

interface FunctionalizedModalParam<ModalRes> {
  success: [SuccessKey, SuccessCallback<ModalRes>?],
  close: [CloseKey],
  props?: Object
}

type FunctionalizedModal<ModalRes> = (param: FunctionalizedModalParam<ModalRes>) => Promise<[boolean, ModalRes]>
```

And you can use like:

```ts
import functionalize from 'func-modal'
import SomeModal, { SomeRes } from 'some/modal/path'

const FuncModal: FunctionalizedModalParam<SomeRes> = functionalize(SomeModal)
```



### exmaple

```js
import functionalize from "func-modal";
import SomeModal from "some/modal/path";

const SomeModalFunc = functionalize(SomeModal);

//base way:
const [isSuccess, res] = await SomeModalFunc({
  success: ["onSuccess"],
  close: ["onClose"],
});

//if we need make the modal show when handle business logic
await SomeModalFunc({
  success: [
    "onSuccess",
    async (res) => {
      //... handle business logic
      if (hasHandledOk) {
        // will close if return true
        return true;
      }
      // will still show
      return false;
    },
  ],
  close: ["onClose"],
});

// if we want pass some more props into SomeModal
await SomeModalFunc({
  success: [
    "onSuccess",
    async (res) => {
      //... handle business logic
      if (hasHandledOk) {
        // the modal will disappear
        return true;
      }
      // the modal will still show
      return false;
    },
  ],
  close: ["onClose"],
  props: {
    visible: true,
    title: "Some Custom Title",
  },
});

```





## Q&A

### Where to make Loading ?

Its not recommanded to maintain the loading state outside the Modal component. Modal component should encapsulate it inside itself.

So, `func-modal` will not care about it , and you should create your Modal component like :

```jsx
import React, { useState } from "react";

function Modal({ onSubmit, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const onTrySubmit = async (flag) => {
    setIsLoading(true);
    const hasHandledCorrectly = await onSubmit(flag);
    setIsLoading(false);
    if (hasHandledCorrectly) {
      onClose();
      return;
    }
  };

  return (
    <div>
      <button onClick={() => onTrySubmit(true)}>
        {isLoading ? <LoadingIcon>Submitting...</LoadingIcon> : "Yes"}
      </button>
    </div>
  );

```

 Again, `func-modal`  will not take care of loading state , and its recommand to maintain it wihtin the modal iteself. 

And the Component that use the Modal should not care the `loading` state either.

