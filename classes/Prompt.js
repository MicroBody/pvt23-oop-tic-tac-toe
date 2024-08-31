export default class Prompt {

  // call with await!
  ask(question, onlyAnswerOk = false) {

    // render html for the dialog
    let dialogElement = document.querySelector('dialog');
    dialogElement.innerHTML = /*html*/`
      <h2>${question}</h2>
      <form method="dialog" name="dialog" onsubmit="return dialogAnswer(event)">
        ${!onlyAnswerOk
        ? /*html*/`<input type="text" name="answer">`
        : /*html*/`<input type="submit" class="button" value="OK">`}
      </form>
      `;
    dialogElement.showModal();
    document.forms.dialog.elements.answer?.focus();

    // add an event handler for form submit
    globalThis.dialogAnswer = event => this.answer(event, resolver);


    // return a promise
    // - it will be resolved by the answer method
    let resolver;
    return new Promise(resolve => resolver = resolve);
  }

  answer(event, resolver) {
    resolver(document.forms.dialog.elements.answer?.value);
  }

}