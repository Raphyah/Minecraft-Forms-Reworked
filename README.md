# Minecraft Forms Reworked

This is a reworked version of the behavior of "...FormData" to allow the form to be forced when UI is busy.

## Usage

```js
import './Minecraft_FormUI_Reworked'; // Only need to be imported once in the whole project. Remember to set the directory where the file is located.
import { ActionFormData } from '@minecraft/server-ui';

function openUI(player) {
  const form = new ActionFormData()
    .title('My Title')
    .body('My Text')
    .button('Foo')
    .button('Bar')
    .button('Baz');
  form.force = true; // This will force the form to open, even if the current player's UI is busy
  form.show(player)
    .then(doSomething)
    .catch(console.error);
}
```
