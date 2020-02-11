/** @jsx JSXSlack.h */
import JSXSlack, { Input, Modal, Section, Textarea } from '@speee-js/jsx-slack'

export default ({ name }: { name: string }) => {
  return JSXSlack(
    <Modal title="Article" close="Cancel" callbackId="send_form">
      <Section>
        Hello {name}!
        <p>Create post message</p>
      </Section>

      <Input label="Title" type="text" blockId="title" actionId="title" required />
      <Input label="Tag" type="text" blockId="tags" actionId="tags" placeholder="Set the tag you like" />
      <Textarea label="Content" blockId="body" actionId="body" required />

      <Input type="submit" value="Save" />
    </Modal>
  )
}
