import dotenv from 'dotenv'
import { App } from '@slack/bolt'
import Log4js from 'log4js'
import { LogLevel, ConsoleLogger } from '@slack/logger'

import { SampleFormModal } from './views/Views'

dotenv.config()

Log4js.configure('./src/log/log4js.json')

const systemLogger = Log4js.getLogger('system')

// @slack/loggerにConsoleLoggerというclassが存在するのでそれを拡張する
class CustomLogger extends ConsoleLogger {
  debug(...msg: any[]): void {
    systemLogger.debug(JSON.stringify(msg))
  }
  info(...msg: any[]): void {
    systemLogger.info(JSON.stringify(msg))
  }
  warn(...msg: any[]): void {
    systemLogger.warn(JSON.stringify(msg))
  }
  error(...msg: any[]): void {
    systemLogger.error(JSON.stringify(msg))
  }
}

const customLogger = new CustomLogger()
customLogger.setLevel(LogLevel.DEBUG)

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logger: customLogger
})

const run = async () => {
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
}

run()

app.command('/sample_form_modal', async ({ ack, body, context, payload }) => {
  ack()

  const user_name: string = body.user_name

  try {
    app.client.views.open({
      token: context.botToken,
      trigger_id: payload.trigger_id,
      view: SampleFormModal({ name: user_name })
    })
  } catch (error) {
    console.log(error)
  }
})

interface FormViewStateValues {
  values: {
    title: { title: { value: string } }
    tags: { tags: { value: string } }
    body: { body: { value: string } }
  }
}

app.view('send_form', async ({ ack, body, context, view }) => {
  ack()

  const user_id: string = body.user.id

  const form_view_state_values = (view.state as FormViewStateValues).values
  const form_title = form_view_state_values.title.title.value
  const form_tags = form_view_state_values.tags.tags.value
  const form_body = form_view_state_values.body.body.value


  app.client.chat.postMessage({
    token: context.botToken,
    channel: user_id,
    text: `Title: ${form_title}\nTags: ${form_tags}\nBody: ${form_body}`
  })
})
