import React from 'react';
import { Modal } from 'semantic-ui-react';

const DataModal = props => (
  <Modal defaultOpen={props.isShown}>
    <Modal.Header>Data to Submit</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <p>{props.bathroom.name}</p>

        <p>Submit Changes?</p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default DataModal;
