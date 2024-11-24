import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { postMessageUtils, postMessageFlow } from '@packages/micro-frontends';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular';
  initializePostMessageListener: () => void;
  closePostMessageListener: () => void;
  messageParent: ({ message, src }: { message: string; src: string }) => void;
  callParent: () => void;
  parentMessage?: string;

  constructor() {
    const whitelist = ['http://localhost:5173'];

    const { initializePostMessageListener, closePostMessageListener } =
      postMessageFlow({
        whitelist,
        messageCallback: (event) => {
          const { origin, data } = event;

          if (origin === 'http://localhost:5173') {
            return (this.parentMessage = `Received from parent: ${data}`);
          }

          return;
        },
      });

    const { messageParent } = postMessageUtils();

    this.initializePostMessageListener = initializePostMessageListener;
    this.closePostMessageListener = closePostMessageListener;
    this.messageParent = messageParent;
    this.callParent = () => {
      this.messageParent({ message: 'hello', src: 'http://localhost:5173' });
    };
  }

  ngOnInit() {
    this.initializePostMessageListener();
  }

  ngOnDestroy() {
    this.closePostMessageListener();
  }
}
