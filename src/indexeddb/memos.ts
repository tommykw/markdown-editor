import Dexie from 'dexie'

export interface MemoRecord {
    datetime: string
    title: string
    text: string
}

const NUM_PER_PAGE = 10

const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' })
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async (title: string, text: string): Promise<void> => {
    const datetime = new Date().toISOString()
    await memos.put({ datetime, title, text })
}

export const getMemos = (page: number): Promise<MemoRecord[]> => {
    const offest = (page - 1) * NUM_PER_PAGE
    return memos.orderBy('datetime')
        .reverse()
        .offset(offest)
        .limit(NUM_PER_PAGE)
        .toArray()
}

export const getMemoPageCount = async (): Promise<number> => {
    const totalCount = await memos.count()
    const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
    return pageCount > 0 ? pageCount : 1
}