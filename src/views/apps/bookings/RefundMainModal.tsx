import React, { useState } from 'react';
import { Modal, ModalBody, ModalActions, Button, Card, CardBody, CardTitle, Input, Radio } from "@/components/daisyui";
import { Icon } from "@/components/Icon";
import xIcon from "@iconify/icons-lucide/x";
import { useBookingEmailMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

type RefundMainModalProps = {
    type: string;
    isModalOpen: boolean;
    handleEmailTicketModal: any;
    userEmail: string;
    bookingId: string;
};

const RefundMainModal = ({ isModalOpen, handleEmailTicketModal, userEmail, bookingId, type }: RefundMainModalProps) => {
    const toaster = useToast();
    const [selectedOption, setSelectedOption] = useState<'user' | 'other'>('user');
    const [otherEmail, setOtherEmail] = useState('');

    const [bookingEmail, { isLoading }] = useBookingEmailMutation();

    const handleSend = async () => {
        const emailToSend = selectedOption === 'user' ? userEmail : otherEmail;
        if (selectedOption === 'other' && !otherEmail) {
            toaster.error("Please enter a valid email address.");
            return;
        }
        await bookingEmail({ email_type: type, email: emailToSend, booking_id: bookingId }).then((response: any) => {
            handleEmailTicketModal();
            if ('error' in response) {
                toaster.error("Please try again sometime later. Thanks");
                return;
            }
        });
        toaster.success("Email sent successfully!");
    };

    return (
        <Modal open={isModalOpen} className="w-1/2 max-w-2xl h-11/5">
            <form method="dialog">
                <Button
                    size="sm"
                    color="ghost"
                    shape="circle"
                    className="absolute right-2 top-2"
                    aria-label="Close modal"
                    onClick={handleEmailTicketModal}
                >
                    <Icon icon={xIcon} className="h-4" />
                </Button>
            </form>

            <h3 className="text-md font-semibold mb-2">{type === 'send_ticket_email' ? 'Send Ticket via Email' : 'Send Booking via Email'}</h3>

            <ModalBody>
                <Card className="bg-base-100">
                    <CardBody>
                        <CardTitle>Select Email Destination</CardTitle>
                        <div className="mt-1 flex flex-col gap-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Radio
                                    aria-label="Send to My Email"
                                    color="primary"
                                    checked={selectedOption === 'user'}
                                    onChange={() => setSelectedOption('user')}
                                />
                                <span>Send to my registered email ({userEmail})</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Radio
                                    aria-label="Send to Another Email"
                                    color="primary"
                                    checked={selectedOption === 'other'}
                                    onChange={() => setSelectedOption('other')}
                                />
                                <span>Send to another email</span>
                            </label>

                            {selectedOption === 'other' && (
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={otherEmail}
                                    onChange={(e) => setOtherEmail(e.target.value)}
                                    className="mt-2 w-full"
                                />
                            )}
                        </div>
                    </CardBody>
                </Card>
            </ModalBody>

            <ModalActions>
                <Button color="primary" className='text-md' size="md" onClick={handleSend} loading={isLoading} disabled={isLoading}>
                    Send Email
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default RefundMainModal;
