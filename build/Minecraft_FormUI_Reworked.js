import { system } from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';

/**
 * This is a custom function that uses the native ...FormData.prototype.show() as base to display a form, but with the ability to force the UI to appear.
 * If the player's UI is busy, it will retry every 1 second to call the function again. When the player UI is not busy anymore it should resolve.
 * @param {Player} player A Minecraft Player instance to which the UI should be displayed.
 */
const CUSTOM_SHOW = function(player) {
  return new Promise((resolve, reject) => { // It uses a promise too, just like the original forms.
    const attempt = () => { // This function should repeat over and over again, until the UI is not busy anymore.
      this.CLONE_SHOW(player) // It should call the original function to open the UI first before applying the modifications to it.
        .then(response => {
          /**
           * We'll be checking for 3 things.
           * Booleans usually are way faster to compare due to it being just a value of true or false, so we check for `response.canceled` first.
           * After making sure that the form was cancelled, we'll check if the user UI was busy with `response.cancelationReason`.
           * If both of the above conditions are met, we check for `this.force` to know if the UI should reattempt to open itself.
           */
          if (response.canceled && response.cancelationReason === 'UserBusy' && this.force) {
            system.runTimeout(attempt, 20); // When all the conditions are met, retry after 1 second (20 ticks) by calling `attempt` inside of a timeout.
            return;
          }
          resolve(response); // If the conditions above aren't met, resolve the promise.
        })
        .catch(reject); // Catch and reject if any error occurs during the process.
    };
    
    attempt(); // Attempt to open the UI
  });
};

// Reworked ActionFormData
// Clone method
const CLONE_ACTION_FORM_DATA_SHOW = ActionFormData.prototype.show;

// Add a new "force" property
ActionFormData.prototype.force = false;

// Add stuff to the prototype
Object.defineProperties(ActionFormData.prototype, {
  CLONE_SHOW: {
    value: CLONE_ACTION_FORM_DATA_SHOW
  },
  show: {
    value: CUSTOM_SHOW
  },
});

// Reworked MessageFormData
// Clone method
const CLONE_MESSAGE_FORM_DATA_SHOW = MessageFormData.prototype.show;

// Add a new "force" property
MessageFormData.prototype.force = false;

// Add stuff to the prototype
Object.defineProperties(MessageFormData.prototype, {
  CLONE_SHOW: {
    value: CLONE_MESSAGE_FORM_DATA_SHOW
  },
  show: {
    value: CUSTOM_SHOW
  },
});

// Reworked ModalFormData
// Clone method
const CLONE_MODAL_FORM_DATA_SHOW = ModalFormData.prototype.show;

// Add a new "force" property
ModalFormData.prototype.force = false;

// Add stuff to the prototype
Object.defineProperties(ModalFormData.prototype, {
  CLONE_SHOW: {
    value: CLONE_MODAL_FORM_DATA_SHOW
  },
  show: {
    value: CUSTOM_SHOW
  },
});