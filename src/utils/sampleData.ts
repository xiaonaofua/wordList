// 示例數據，用於測試應用功能
import { addWord } from './wordStorage'

interface SampleWord {
  japanese: string
  reading: string
  chinese: string
  example: string
}

export const sampleWords: SampleWord[] = [
  {
    japanese: '勉強',
    reading: 'べんきょう',
    chinese: '學習',
    example: '毎日日本語を勉強しています。'
  },
  {
    japanese: '友達',
    reading: 'ともだち',
    chinese: '朋友',
    example: '友達と一緒に映画を見ました。'
  },
  {
    japanese: '美味しい',
    reading: 'おいしい',
    chinese: '好吃的',
    example: 'この料理はとても美味しいです。'
  },
  {
    japanese: '図書館',
    reading: 'としょかん',
    chinese: '圖書館',
    example: '図書館で本を借りました。'
  },
  {
    japanese: '電車',
    reading: 'でんしゃ',
    chinese: '電車',
    example: '電車で学校に行きます。'
  },
  {
    japanese: '天気',
    reading: 'てんき',
    chinese: '天氣',
    example: '今日の天気はとてもいいです。'
  },
  {
    japanese: '買い物',
    reading: 'かいもの',
    chinese: '購物',
    example: '週末に買い物に行きます。'
  },
  {
    japanese: '仕事',
    reading: 'しごと',
    chinese: '工作',
    example: '新しい仕事を始めました。'
  }
]

// 添加示例數據的函數
export const addSampleData = async (): Promise<void> => {
  for (const word of sampleWords) {
    await addWord(word.japanese, word.reading, word.chinese, word.example)
  }
  console.log('示例數據已添加')
}

// 在開發環境中可以調用此函數來快速添加測試數據
// addSampleData();
