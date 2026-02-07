import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DocumentSource = 'timestamp' | 'verify';

export type DocumentRecord = {
  id: string;
  name: string;
  hash: `0x${string}`;
  timestamp: number;
  owner?: string;
  txHash?: `0x${string}`;
  source: DocumentSource;
  createdAt: number;
  viewerAddress: string;
};

type DocumentsState = {
  documents: DocumentRecord[];
  addDocument: (doc: DocumentRecord) => void;
  clearDocumentsForViewer: (viewerAddress: string) => void;
};

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [],
      addDocument: (doc) => {
        const existing = get().documents.find((item) => item.id === doc.id);
        if (existing) {
          set({
            documents: get().documents.map((item) =>
              item.id === doc.id ? { ...item, ...doc } : item
            ),
          });
          return;
        }
        set({ documents: [doc, ...get().documents] });
      },
      clearDocumentsForViewer: (viewerAddress) => {
        set({
          documents: get().documents.filter(
            (doc) => doc.viewerAddress !== viewerAddress
          ),
        });
      },
    }),
    {
      name: 'ip-timestamp-documents',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
