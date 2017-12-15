import applyPropertiesById from '../src/applyPropertiesById.js';


describe("applyPropertiesById", () => {

  it("applies properties to referenced elements", () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div id='foo'></div>
      <div id='bar'></div>
    `
    const fixture = template.content;
    applyPropertiesById(fixture, {
      foo: {
        attributes: {
          role: 'main'
        }
      },
      bar: {
        attributes: {
          role: 'button'
        }
      }
    });
    assert.equal(fixture.children[0].getAttribute('role'), 'main');
    assert.equal(fixture.children[1].getAttribute('role'), 'button');
  });

});
