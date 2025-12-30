<template>
	<div class="min-h-screen flex items-center justify-center p-4">
		<div class="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
			<header class="px-4 py-3 border-b">
				<h1 class="text-lg font-semibold">Chatbot</h1>
				<p class="text-sm text-gray-500">Powered by Google Gemini — add your API key.</p>
			</header>

			<main data-chat-body class="p-4 flex-1 overflow-y-auto space-y-3">
				<div v-for="(m, i) in messages" :key="i" class="flex">
					<div v-if="m.role==='assistant'" class="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-[80%]">
						{{ m.text }}
					</div>
					<div v-else class="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[80%]">
						{{ m.text }}
					</div>
				</div>
			</main>

			<form @submit.prevent="send" class="p-3 border-t flex items-center gap-2">
				<input v-model="input" :disabled="loading" placeholder="Ask a question..." class="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring" />
				<button :disabled="loading || !input.trim()" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{{ loading ? 'Sending...' : 'Send' }}</button>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([
	{ role: 'assistant', text: 'Hi — I am your chatbot. Ask me anything.' }
])
const loading = ref(false)

function scrollToBottom() {
	setTimeout(() => {
		const el = document.querySelector('[data-chat-body]')
		if (el) el.scrollTop = el.scrollHeight
	}, 50)
}

async function send() {
	if (!input.value.trim()) return
	messages.value.push({ role: 'user', text: input.value })
	const messageText = input.value
	input.value = ''
	loading.value = true
	scrollToBottom()
	try {
		const res = await $fetch('https://jairam-chatbot.vercel.app/jairam-chatbot/api/chat', { method: 'POST', body: { message: messageText } })
		if (res?.reply) messages.value.push({ role: 'assistant', text: res.reply })
		else messages.value.push({ role: 'assistant', text: res.error || 'No response' })
	} catch (e) {
		messages.value.push({ role: 'assistant', text: String(e) })
	} finally {
		loading.value = false
		scrollToBottom()
	}
}
</script>

<style scoped></style>