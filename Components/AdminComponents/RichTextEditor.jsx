'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import axios from 'axios'
import { useRef } from 'react'
import { toast } from 'react-toastify'

const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
            isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
)

const RichTextEditor = ({ value, onChange }) => {
    const fileInputRef = useRef(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TiptapImage.configure({
                HTMLAttributes: { class: 'rounded-xl' }
            }),
            Placeholder.configure({
                placeholder: 'Write your story... use the toolbar to add subheadings and images.'
            })
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'blog-content min-h-[260px] px-4 py-3 outline-none'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    const handleImagePick = () => fileInputRef.current?.click()

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await axios.post('/api/upload', formData)
            if (res.data.success) {
                editor.chain().focus().setImage({ src: res.data.url }).run()
            } else {
                toast.error('Image upload failed')
            }
        } catch (err) {
            toast.error('Image upload failed')
        } finally {
            e.target.value = ''
        }
    }

    if (!editor) return null

    return (
        <div className='rounded-xl border border-gray-200 focus-within:border-black transition-all overflow-hidden bg-white'>
            {/* Toolbar */}
            <div className='flex flex-wrap items-center gap-1 px-2 py-2 border-b border-gray-100 bg-gray-50'>
                <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>B</ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><i>I</i></ToolbarButton>

                <div className='w-px h-5 bg-gray-200 mx-1' />

                <ToolbarButton title="Subheading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>H2</ToolbarButton>
                <ToolbarButton title="Smaller subheading" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>H3</ToolbarButton>
                <ToolbarButton title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')}>¶</ToolbarButton>

                <div className='w-px h-5 bg-gray-200 mx-1' />

                <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>&bull; List</ToolbarButton>
                <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>1. List</ToolbarButton>

                <div className='w-px h-5 bg-gray-200 mx-1' />

                <ToolbarButton title="Insert image" onClick={handleImagePick}>🖼 Image</ToolbarButton>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </div>

            {/* Editable area */}
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor
