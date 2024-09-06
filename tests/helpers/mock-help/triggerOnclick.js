// click should work out of the box with Happy DOM
// el.click()
// but doesn't with our 'old school' onclick handlers
// so we create a small helper for click

export default function triggerOnclick(element) {
  let onClick = element.getAttribute('onclick');
  let f = new Function('globalThis.' + onClick);
  f();
}