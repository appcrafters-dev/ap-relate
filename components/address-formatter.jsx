export default function AddressFormatter({ address }) {
  return (
    <div>
      {address.address_line1}
      <br />
      {address.address_line2 && (
        <span>
          {address.address_line2}
          <br />
        </span>
      )}
      {address.city}, {address.state} {address.pincode}
    </div>
  );
}
