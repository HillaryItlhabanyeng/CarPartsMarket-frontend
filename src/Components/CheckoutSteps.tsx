type Props = {
    currentStep: 1 | 2 | 3;
};

export default function CheckoutSteps({ currentStep }: Props) {
    const steps = [
        { number: 1, label: "Details" },
        { number: 2, label: "Payment" },
        { number: 3, label: "Confirmation" },
    ];

    return (
        <div className="checkout-steps">
            {steps.map((step, index) => (
                <div key={step.number} className="checkout-step">
                    <div className={`step-circle ${step.number === currentStep ? "active" : ""}`}>
                        {step.number}
                    </div>
                    <span className={step.number === currentStep ? "step-label active" : "step-label"}>
                        {step.label}
                    </span>
                    {index < steps.length - 1 && <div className="step-line" />}
                </div>
            ))}
        </div>
    );
}
    
