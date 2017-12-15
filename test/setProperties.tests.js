import * as setProperties from '../src/setProperties.js';


describe("setProperties", () => {

  it("applyAttribute handles regular attributes", () => {
    const fixture = document.createElement('div');
    setProperties.applyAttribute(fixture, 'aria-selected', 'true');
    assert.equal(fixture.getAttribute('aria-selected'), 'true');
    setProperties.applyAttribute(fixture, 'aria-selected', null);
    assert.equal(fixture.getAttribute('aria-selected'), null);
  });

  it("applyAttribute handles boolean attributes", () => {
    const fixture = document.createElement('button');
    setProperties.applyAttribute(fixture, 'disabled', true);
    assert.equal(fixture.disabled, true);
    setProperties.applyAttribute(fixture, 'disabled', false);
    assert.equal(fixture.disabled, false);
  });

  it("applyClassList turns multiple classes on or off", () => {
    const fixture = document.createElement('div');
    setProperties.applyClassList(fixture, { 'foo': true, 'bar': true });
    assert(fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    setProperties.applyClassList(fixture, { 'foo': false });
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
  });

  it("applyChildNodes updates child nodes", () => {
    const fixture = document.createElement('div');
    const existingChild = document.createTextNode('existing');
    fixture.appendChild(existingChild);
    const nodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    setProperties.applyChildNodes(fixture, nodes);
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], nodes[0]);
    assert.equal(fixture.childNodes[1], nodes[1]);
    assert.isNull(existingChild.parentNode);
  });

  it("setProperties merges new updates on top of existing attributes", () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="foo bar" style="color: red;" aria-selected="false"></div>
    `;
    const fixture = template.content.children[0];
    setProperties.default(fixture, {
      attributes: {
        'aria-selected': 'true'
      },
      classList: {
        foo: false,
        bletch: true
      },
      style: {
        color: 'green'
      }
    });
    assert.equal(fixture.getAttribute('aria-selected'), 'true');
    assert(!fixture.classList.contains('foo'));
    assert(fixture.classList.contains('bar'));
    assert(fixture.classList.contains('bletch'));
    assert.equal(fixture.style.color, 'green');
  });

  it("setProperties with childNodes updates child nodes", () => {
    const fixture = document.createElement('div');
    const existingChild = document.createTextNode('existing');
    fixture.appendChild(existingChild);
    const nodes = [
      document.createTextNode('one'),
      document.createTextNode('two')
    ];
    setProperties.default(fixture, {
      childNodes: nodes
    });
    assert.equal(fixture.childNodes.length, 2);
    assert.equal(fixture.childNodes[0], nodes[0]);
    assert.equal(fixture.childNodes[1], nodes[1]);
    assert.isNull(existingChild.parentNode);
  });

});
