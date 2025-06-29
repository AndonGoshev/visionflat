export interface ToastItem {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    [key: string]: any;
}
export declare function useToast(): {
    toasts: ToastItem[];
    addToast: (toast: ToastItem) => void;
    removeToast: (id: string) => void;
};
