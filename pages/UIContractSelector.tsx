import type { NextPage } from 'next'
import { Form, Row, Button, Container } from 'react-bootstrap'
import { ReactElement, useState } from 'react'
import LMHTTPClient from '../utils/httpClient/LMHTTPClient';

interface UIContractSelectorProps {
  defaultContractAddress: string,
  setContractAddress: (a: string) => void
}

const UIContractSelector: NextPage<UIContractSelectorProps> = (props: UIContractSelectorProps) => {

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formContractAddress.value;
      props.setContractAddress(address);
    }
    setValidated(true);
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formContractAddress">
            <Form.Label>Token contract address</Form.Label>
            <Form.Control required type="text" placeholder="0x123456789..." defaultValue={props.defaultContractAddress} />
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">Save</Button>
      </Form>
    </Container>
  );
}

export default UIContractSelector;
