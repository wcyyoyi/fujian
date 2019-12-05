export class DisplayMenu {
    id: string;
    title: string;
    type: string;
    elements: Array<{ label: string, value: string, children: DisplayMenu }>;
}
